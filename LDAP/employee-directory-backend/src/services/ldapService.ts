import ldap from 'ldapjs';
import { User } from '../types';

class LdapService {
  private ldapUrl: string;
  private baseDn: string;
  private bindDn: string;
  private bindPassword: string;
  private usersOu: string;

  constructor() {
    this.ldapUrl = process.env.LDAP_URL || 'ldap://localhost:389';
    this.baseDn = process.env.LDAP_BASE_DN || 'dc=techcorp,dc=local';
    this.bindDn = process.env.LDAP_BIND_DN || 'cn=admin,dc=techcorp,dc=local';
    this.bindPassword = process.env.LDAP_BIND_PASSWORD || 'admin123';
    this.usersOu = process.env.LDAP_USERS_OU || 'ou=people,dc=techcorp,dc=local';
  }

  // Create LDAP client
  private createClient(): ldap.Client {
    return ldap.createClient({
      url: this.ldapUrl,
    });
  }

  // Authenticate user with LDAP
  async authenticateUser(username: string, password: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const client = this.createClient();
      const userDn = `uid=${username},${this.usersOu}`;

      // Try to bind (login) with user credentials
      client.bind(userDn, password, (err) => {
        if (err) {
          client.unbind();
          resolve(null); // Authentication failed
          return;
        }

        // If bind successful, fetch user details
        this.getUserByUid(username)
          .then((user) => {
            client.unbind();
            resolve(user);
          })
          .catch((error) => {
            client.unbind();
            reject(error);
          });
      });
    });
  }

  // Get user by UID
  async getUserByUid(uid: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const client = this.createClient();

      // First, bind as admin to search
      client.bind(this.bindDn, this.bindPassword, (bindErr) => {
        if (bindErr) {
          client.unbind();
          reject(new Error('LDAP bind failed'));
          return;
        }

        // Search for user
        const searchOptions: ldap.SearchOptions = {
          filter: `(uid=${uid})`,
          scope: 'sub',
          attributes: ['uid', 'cn', 'sn', 'givenName', 'mail', 'telephoneNumber', 'departmentNumber', 'title'],
        };

        client.search(this.usersOu, searchOptions, (searchErr, searchRes) => {
          if (searchErr) {
            client.unbind();
            reject(searchErr);
            return;
          }

          let user: User | null = null;

          searchRes.on('searchEntry', (entry) => {
            const obj = entry.pojo;
            user = this.mapLdapEntryToUser(obj);
          });

          searchRes.on('error', (err) => {
            client.unbind();
            reject(err);
          });

          searchRes.on('end', () => {
            client.unbind();
            resolve(user);
          });
        });
      });
    });
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      const client = this.createClient();

      client.bind(this.bindDn, this.bindPassword, (bindErr) => {
        if (bindErr) {
          client.unbind();
          reject(new Error('LDAP bind failed'));
          return;
        }

        const searchOptions: ldap.SearchOptions = {
          filter: '(objectClass=inetOrgPerson)',
          scope: 'sub',
          attributes: ['uid', 'cn', 'sn', 'givenName', 'mail', 'telephoneNumber', 'departmentNumber', 'title'],
        };

        const users: User[] = [];

        client.search(this.usersOu, searchOptions, (searchErr, searchRes) => {
          if (searchErr) {
            client.unbind();
            reject(searchErr);
            return;
          }

          searchRes.on('searchEntry', (entry) => {
            const obj = entry.pojo;
            const user = this.mapLdapEntryToUser(obj);
            if (user) {
              users.push(user);
            }
          });

          searchRes.on('error', (err) => {
            client.unbind();
            reject(err);
          });

          searchRes.on('end', () => {
            client.unbind();
            resolve(users);
          });
        });
      });
    });
  }

  // Helper: Map LDAP entry to User object
  private mapLdapEntryToUser(ldapEntry: any): User | null {
    try {
      const attrs = ldapEntry.attributes;
      
      return {
        uid: this.getAttributeValue(attrs, 'uid'),
        cn: this.getAttributeValue(attrs, 'cn'),
        sn: this.getAttributeValue(attrs, 'sn'),
        givenName: this.getAttributeValue(attrs, 'givenName'),
        mail: this.getAttributeValue(attrs, 'mail'),
        telephoneNumber: this.getAttributeValue(attrs, 'telephoneNumber'),
        departmentNumber: this.getAttributeValue(attrs, 'departmentNumber'),
        title: this.getAttributeValue(attrs, 'title'),
        dn: ldapEntry.objectName,
      };
    } catch (error) {
      console.error('Error mapping LDAP entry:', error);
      return null;
    }
  }

  // Helper: Get attribute value from LDAP entry
  private getAttributeValue(attributes: any[], attrName: string): string {
    const attr = attributes.find((a: any) => a.type === attrName);
    return attr && attr.values && attr.values.length > 0 ? attr.values[0] : '';
  }
}

export default new LdapService();